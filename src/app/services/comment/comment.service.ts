import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../../interfaces/Comment';
import { Response } from '../../interfaces/Response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}/api/moments`;

  constructor(private http: HttpClient) { }

  createComment(data: Comment): Observable<Response<Comment>> {
    const url = `${this.apiUrl}/${data.momentId}/comments`;
    return this.http.post<Response<Comment>>(url, data);
  }
}