import tinyMsgpack from 'tiny-msgpack';
import WebSocket from 'ws';
import Logger from './logger.mjs';

class Ribbon {
  constructor(link) {
    this.id = 1;
    this.ws = new WebSocket(link);
    this.commandQueue = [];
    this.bufferQueue = [];
    this.handleResponse = () => {};
    this.logger = new Logger();

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
          this.handleResponse(decodedData);
          break;
        }

        // Extracted id tag
        // 1 byte of marker, 4 bytes(32 bits) of extracted id
        case 0xae: {
          const decodedData = tinyMsgpack.decode(data.slice(1));
          this.logger.info('Recieved data 0xae', decodedData);
          this.handleResponse(decodedData);
          break;
        }

        case 0xb0: {
          this.logger.info('Pong!', data.slice(1));
          break;
        }

        default: {
          this.logger.warn('Unknown data', tinyMsgpack.decode(data.slice(1)));
          break;
        }
      }
    });
  }

  async waitForWebSocket() {
    return new Promise((resolve) => {
      this.ws.on('open', () => {
        this.logger.info('Ribbon connection opened', null);
        resolve();
      });
    });
  }

  flushCommandQueue() {
    this.commandQueue.forEach(() => {
      this.logger.warn('Forcing to send command', this.commandQueue[0].command);
      this.ws.send(tinyMsgpack.encode(this.commandQueue.shift()));
    });
  }

  sendCommand(commandObject) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      this.logger.info('Adding command to queue', commandObject.command);
      this.commandQueue.push(commandObject);
    } else {
      this.flushCommandQueue();
      this.logger.info('Sending command', commandObject.command);
      this.ws.send(tinyMsgpack.encode(commandObject));
    }
  }

  flushBufferQueue() {
    this.bufferQueue.forEach(() => {
      this.logger.warn('Forcing to send buffer', this.bufferQueue[0]);
      this.ws.send(this.bufferQueue.shift());
    });
  }

  sendBuffer(buffer) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      this.logger.info('Adding buffer to queue', buffer);
      this.bufferQueue.push(buffer);
    } else {
      this.flushBufferQueue();
      this.logger.info('Sending buffer', buffer);
      this.ws.send(buffer);
    }
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
