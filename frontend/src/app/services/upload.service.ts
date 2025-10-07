import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  uploadArquivo(cursoId: string, moduloId: string | null, arquivo: File, tipoArquivo: string, titulo: string): Observable<any> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    
    if (moduloId) {
      formData.append('moduloId', moduloId);
    }
    
    formData.append('tipoArquivo', tipoArquivo);
    formData.append('titulo', titulo);
    
    return this.http.post(`${this.apiUrl}/cursos/${cursoId}/upload`, formData);
  }
}