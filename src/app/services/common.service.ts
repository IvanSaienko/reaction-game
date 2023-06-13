import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public arrayRandElement<T>(arr: T[]): T {
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
  }

  public chunkArray<T>(array: T[], size: number): T[][] {
    if (size <= 0) {
      throw new Error("Size should be a positive number");
    }
    
    const length = array.length;
    const chunkedArray: T[][] = [];
    let index = 0;

    while (index < length) {
      chunkedArray.push(array.slice(index, index + size));
      index += size;
    }

    return chunkedArray;
  }
}
