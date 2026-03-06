from pydantic import BaseModel
from typing import List, Optional

class Club(BaseModel):
    name: str
    description: str
    members: List[str] = []
