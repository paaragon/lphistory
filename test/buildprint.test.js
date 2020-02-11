const moment = require('moment');
const eventPrinter = require('../lib/search/eventprinter');
const expect = require('chai').expect;
const expected = require('./mocks/expected.mock');
const msgMocks = require('./mocks/events.mock');

const time = moment.utc([2010, 1, 14, 15, 25, 50, 125]).toDate().getTime();

describe('Build Print', () => {
  it('Build Start', () => {
    const event = { type: 'start', time: time, data: { timeL: time, conversationId: 'xxx-xxx-xxx-xxx' } };
    const print = eventPrinter.buildPrint(event, time, 80);
    expect(print).to.be.eq(expected.expectedStart);
  });

  it('Build End undefined', () => {
    const event = { type: 'end', time: 0, data: { timeL: 0, conversationId: 'xxx-xxx-xxx-xxx' } };
    const print = eventPrinter.buildPrint(event, 0, 80);
    expect(print).to.be.eq(undefined);
  });

  it('Build End', () => {
    const event = { type: 'end', time: time, data: { timeL: time, conversationId: 'xxx-xxx-xxx-xxx' } };
    const print = eventPrinter.buildPrint(event, time, 80);
    expect(print).to.be.eq(expected.expectedEnd);
  });

  it('Build Msg', () => {
    const event = { type: 'msg', time: 0, data: msgMocks.msg1 };
    const print = eventPrinter.buildPrint(event, 0, 80);
    expect(print).to.be.eq(expected.expectedMsg1);
  });

  it('Build Transfer', () => {
    const event = { type: 'transfer', time: 0, data: msgMocks.transfer1 };
    const print = eventPrinter.buildPrint(event, 0, 80);
    expect(print).to.be.eq(expected.expectedTransfer1);
  });

  it('Build Participant', () => {
    const event = { type: 'participant', time: 0, data: msgMocks.participant1 };
    const print = eventPrinter.buildPrint(event, 0, 80);
    expect(print).to.be.eq(expected.expectedParticipant1);
  });
});