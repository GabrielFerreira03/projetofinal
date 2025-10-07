import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthGuard = class AuthGuard {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    canActivate() {
        if (this.authService.isAutenticado()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
};
AuthGuard = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map