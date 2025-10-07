import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
let UploadService = class UploadService {
    constructor(http) {
        this.http = http;
        this.apiUrl = environment.apiUrl;
    }
    uploadArquivo(cursoId, moduloId, arquivo, tipoArquivo, titulo) {
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        if (moduloId) {
            formData.append('moduloId', moduloId);
        }
        formData.append('tipoArquivo', tipoArquivo);
        formData.append('titulo', titulo);
        return this.http.post(`${this.apiUrl}/cursos/${cursoId}/upload`, formData);
    }
};
UploadService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map