from sqlmodel import SQLModel, Field

class RefreshToken(SQLModel, table=True):
    id: int = Field(primary_key=True)
    refresh_token: str
