"""
Authentication routes: register, login, me, logout.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models.models import User, AuditLog
from app.schemas.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.permissions import get_permissions_for_role
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password(request.password),
        role=request.role,
        department=request.department,
        organization=request.organization,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        department=user.department,
        organization=user.organization,
        is_active=user.is_active,
        permissions=get_permissions_for_role(user.role),
        created_at=user.created_at,
        last_login=user.last_login,
    )

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    
    # Log audit
    audit = AuditLog(user_id=user.id, action="LOGIN", resource_type="user", resource_id=user.id)
    db.add(audit)
    db.commit()
    
    # Create JWT
    token = create_access_token(data={"sub": user.id, "role": user.role})
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            role=user.role,
            department=user.department,
            organization=user.organization,
            is_active=user.is_active,
            permissions=get_permissions_for_role(user.role),
            created_at=user.created_at,
            last_login=user.last_login,
        )
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        role=current_user.role,
        department=current_user.department,
        organization=current_user.organization,
        is_active=current_user.is_active,
        permissions=get_permissions_for_role(current_user.role),
        created_at=current_user.created_at,
        last_login=current_user.last_login,
    )

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    audit = AuditLog(user_id=current_user.id, action="LOGOUT", resource_type="user", resource_id=current_user.id)
    db.add(audit)
    db.commit()
    return {"message": "Logged out successfully"}
