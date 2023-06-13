import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;
  let arrNumbers: number[]

  beforeEach(() => {
    service = new CommonService();
    arrNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should chunk array', () => {
    const chunkedArr = service.chunkArray<number>(arrNumbers, 2);
    expect(chunkedArr.length).toBe(Math.ceil(arrNumbers.length/2));
    expect(chunkedArr[0][0]).toBe(1);
  });

  it('should return random item of array', () => {
    const rndItem = service.arrayRandElement<number>(arrNumbers);
    expect(arrNumbers.includes(rndItem)).toBeTruthy();
    expect(typeof rndItem).toBe('number');
  });
});
