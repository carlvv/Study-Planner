from dataclasses import dataclass

from db.collections.base_model import BaseModel


@dataclass(kw_only=True)  # Was macht das?
class Day:
    day_id: int
    desc: str


@dataclass(kw_only=True)
class Timeslot:
    timeslot_id: int
    desc: str


@dataclass(kw_only=True)
class Room:
    room_id: int
    desc_kurz: str
    desc_lang: str


@dataclass(kw_only=True)
class Lecturer:
    lecturer_id: int
    type: str
    short: str
    name: str


@dataclass(kw_only=True)
class Specialisation:
    specialisation_id: int
    is_FH: bool
    is_Master: bool
    desc_short: str
    desc_long: str

@dataclass(kw_only=True)
class Listener:
    specialisation_id: int
    recommSemester: list[int]

@dataclass(kw_only=True)
class DayEvent:
    day: Day
    start_time: Timeslot
    end_time: Timeslot
    rooms: list[Room]


@dataclass(kw_only=True)
class Event(BaseModel):
    event_id: int
    name: str
    name_add: str
    course_id: str
    optional: bool
    days: list[DayEvent]
    listeners: list[Listener]