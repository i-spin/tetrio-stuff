import tinyMsgpack from 'tiny-msgpack';
import WebSocket from 'ws';
import Logger from './logger.mjs';

class Ribbon {
  constructor(link) {
    this.id = 1;
    this.ws = new WebSocket(link);
    this.commandQueue = [];
    this.bufferQueue = [];
    this.logger = new Logger();

    this.ws.on('open', () => {
      this.logger.info('Ribbon connection opened', null);
      this.flushCommandQueue();
      this.flushBufferQueue();
    });

    this.ws.on('close', () => {
      this.logger.info('Ribbon connection closed', null);
    });

    this.ws.on('message', (data) => {
      this.newId();

      switch (data.slice(0, 1)[0]) {
        // Standard id tag
        // everything after the first byte can be unpacked and processed
        case 0x45: {
          const decodedData = tinyMsgpack.decode(data.slice(1));
          if (decodedData.resume) this.resume(data.id, data.resume);
          if (decodedData.command === 'nope') {
            this.logger.critical('Error from server', decodedData);
            break;
          }
          this.logger.info('Recieved data 0x45', decodedData);
          break;
        }

        // Extracted id tag
        // 1 byte of marker, 4 bytes(32 bits) of extracted id
        case 0xae: {
          const decodedData = tinyMsgpack.decode(data.slice(1));
          this.logger.info('Recieved data 0xae', decodedData);
          break;
        }

        default: {
          this.logger.warn('Unknown data', tinyMsgpack.decode(data.slice(1)));
          break;
        }
      }
    });
  }

  sendCommand(commandObject) {
    this.logger.info('Adding command to queue', commandObject);
    this.commandQueue.push(commandObject);
    if (this.ws.readyState !== WebSocket.OPEN) return false;
    this.commandQueue.forEach(() => {
      this.logger.info('Sending command', this.commandQueue[0]);
      this.ws.send(tinyMsgpack.encode(this.commandQueue.shift()));
    });
    return true;
  }

  flushCommandQueue() {
    this.commandQueue.forEach(() => {
      this.logger.warn('Forcing to send command', this.commandQueue[0]);
      this.ws.send(tinyMsgpack.encode(this.commandQueue.shift()));
    });
  }

  sendBuffer(buffer) {
    this.logger.info('Adding buffer to queue', buffer);
    this.bufferQueue.push(buffer);
    if (this.ws.readyState !== WebSocket.OPEN) return false;
    this.bufferQueue.forEach(() => {
      this.logger.info('Sending buffer', this.bufferQueue[0]);
      this.ws.send(this.bufferQueue.shift());
    });
    return true;
  }

  flushBufferQueue() {
    this.bufferQueue.forEach(() => {
      this.logger.warn('Forcing to send buffer', this.bufferQueue[0]);
      this.ws.send(this.bufferQueue.shift());
    });
  }

  ping() {
    const buf = Buffer.alloc(2);
    buf.writeUInt8(0xB0, 0);
    buf.write('ping', 1);
    this.sendBuffer(buf);
  }

  connect() {
    this.sendCommand({
      command: 'new',
    });
  }

  authorize(id, token, handling, signature, i) {
    this.sendCommand({
      id,
      command: 'authorize',
      token,
      handling,
      signature,
      i,
    });
  }

  resume(socketId, resumeToken) {
    this.sendCommand({
      command: 'resume',
      socketid: socketId,
      resumetoken: resumeToken,
    });
  }

  disconnect() {
    this.sendCommand({
      command: 'die',
    });
  }

  newId() {
    this.id += 1;
    return this.id;
  }
}

export default Ribbon;
