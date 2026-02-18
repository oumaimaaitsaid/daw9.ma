import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MoodboardService } from './moodboard.service';
import { environment } from '../../../environments/environment';

describe('MoodboardService', () => {
  let service: MoodboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoodboardService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MoodboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch moodboard images', () => {
    const mockResponse = {
      content: [
        { id: 1, imageUrl: 'test1.jpg', prompt: 'test' }
      ]
    };

    service.getMoodboard().subscribe(res => {
      expect(res.content.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/client/moodboard`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should upload images in bulk', () => {
    const mockResponse = [{ id: 1, imageUrl: 'test.jpg' }];
    const formData = new FormData();

    service.uploadBulk(formData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/client/moodboard/upload-bulk`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
