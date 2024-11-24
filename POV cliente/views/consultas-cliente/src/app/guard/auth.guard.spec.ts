import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthService]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access if user is logged in', () => {
    // Simula o estado de logado
    spyOn(authService, 'isLoggedIn').and.returnValue(true);

    const canActivate = authGuard.canActivate({} as any, {} as any);
    expect(canActivate).toBeTrue();
  });

  it('should redirect to login if user is not logged in', () => {
    // Simula o estado de não logado
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    const canActivate = authGuard.canActivate({} as any, {} as any);
    expect(canActivate).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
