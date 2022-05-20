import {differenceInSeconds, parseISO} from 'date-fns';
import Span from '../Span.model';
import SpanMock from '../__mocks__/Span.mock';

describe('Span', () => {
  it('should generate a span object', () => {
    const rawSpan = SpanMock.raw();
    const span = Span(rawSpan);

    expect(Array.isArray(span.signature)).toBe(true);
    expect(typeof span.attributes).toEqual('object');
    expect(Array.isArray(span.attributeList)).toBe(true);
    const value = rawSpan.attributes!['service.name'];
    expect(span.attributes['service.name'].value).toEqual(value);

    const duration = differenceInSeconds(parseISO(rawSpan.startTime!), parseISO(rawSpan.endTime!));

    expect(span.duration).toEqual(duration);
  });
});
