from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class ApiKnowledge:
    intent: str
    endpoint: str
    method: str = "GET"
    payload_template: dict[str, Any] = field(default_factory=dict)
    headers: dict[str, str] = field(default_factory=dict)
    confidence: float = 0.5


@dataclass
class StrategyResult:
    intent: str
    strategy: str
    success: bool
    elapsed_ms: float
    details: dict[str, Any] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class IntentContext:
    intent: str
    hints: list[str]
    action: str
    value: Any | None = None
