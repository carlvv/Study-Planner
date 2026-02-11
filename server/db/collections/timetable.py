
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Union
from db.collections.base_model import BaseModel
from db.collections.events import Event, DayEvent


@dataclass(kw_only=True)
class TimeTable(BaseModel):
    semester: str
    owner_id: str
    active: bool
    name: str 
    event_ids: List[str] = field(default_factory=list)  

    def add_event(self, id: str):
        self.event_ids.append(id)

    def delete_event(self, id: str):
        self.event_ids.remove(id)


@dataclass
class TimetableSlot:
    """Represents a single slot in the timetable."""
    event: Event
    day_event: Union[DayEvent, Dict]
    
    @property
    def day_id(self) -> int:
        if isinstance(self.day_event, dict):
            return self.day_event['day']['day_id']
        return self.day_event.day.day_id
    
    @property
    def day_name(self) -> str:
        if isinstance(self.day_event, dict):
            return self.day_event['day']['desc']
        return self.day_event.day.desc
    
    @property
    def timeslot_id(self) -> int:
        if isinstance(self.day_event, dict):
            return self.day_event['start_time']['timeslot_id']
        return self.day_event.start_time.timeslot_id
    
    @property
    def time_desc(self) -> str:
        if isinstance(self.day_event, dict):
            return self.day_event['start_time']['desc']
        return self.day_event.start_time.desc
    
    @property
    def rooms(self) -> str:
        if isinstance(self.day_event, dict):
            return ", ".join([r['desc_kurz'] for r in self.day_event['rooms']])
        return ", ".join([r.desc_kurz for r in self.day_event.rooms])
    
    def __repr__(self) -> str:
        return f"{self.event.name} ({self.time_desc}) - {self.rooms}"


@dataclass
class Conflict:
    """Represents a conflict between two timetable slots."""
    slot1: TimetableSlot
    slot2: TimetableSlot
    day_id: int
    timeslot_id: int
    
    def __repr__(self) -> str:
        return (f"Conflict on {self.slot1.day_name} at timeslot {self.timeslot_id}: "
                f"'{self.slot1.event.name}' vs '{self.slot2.event.name}'")


class Timetable:
    """
    Creates and manages a timetable from a list of events.
    
    The timetable is organized by day (1-5 for Mon-Fri) and timeslot.
    It can detect conflicts when multiple events occupy the same slot.
    """
    
    DAY_NAMES = {
        1: "Montag",
        2: "Dienstag", 
        3: "Mittwoch",
        4: "Donnerstag",
        5: "Freitag"
    }
    
    TIMESLOTS = {
        1: "08:00 - 09:15",
        2: "09:30 - 10:45",
        3: "11:00 - 12:15",
        4: "12:30 - 13:45",
        5: "14:00 - 15:15",
        6: "15:30 - 16:45",
        7: "17:00 - 18:15",
        8: "18:30 - 19:45"
    }
    
    def __init__(self, events: Optional[List[Event]] = None):
        """
        Initialize timetable with optional list of events.
        
        Args:
            events: List of Event objects to add to the timetable
        """
        self._schedule: Dict[int, Dict[int, List[TimetableSlot]]] = {}
        self._events: List[Event] = []
        self._conflicts: List[Conflict] = []
        
        for day_id in range(1, 6):
            self._schedule[day_id] = {}
        
        if events:
            self.add_events(events)
    
    def add_event(self, event: Event) -> List[Conflict]:
        """
        Add a single event to the timetable.
        
        Args:
            event: Event object to add
            
        Returns:
            List of conflicts created by adding this event
        """
        new_conflicts = []
        self._events.append(event)
        
        for day_event in event.days:
            if isinstance(day_event, dict):
                day_id = day_event['day']['day_id']
                start_slot = day_event['start_time']['timeslot_id']
                end_slot = day_event['end_time']['timeslot_id']
            else:
                day_id = day_event.day.day_id
                start_slot = day_event.start_time.timeslot_id
                end_slot = day_event.end_time.timeslot_id
            
            slot = TimetableSlot(event=event, day_event=day_event)
            
            for timeslot_id in range(start_slot, end_slot + 1):
                if day_id not in self._schedule:
                    self._schedule[day_id] = {}
                
                if timeslot_id not in self._schedule[day_id]:
                    self._schedule[day_id][timeslot_id] = []
                
                existing_slots = self._schedule[day_id][timeslot_id]
                for existing in existing_slots:
                    conflict = Conflict(
                        slot1=existing,
                        slot2=slot,
                        day_id=day_id,
                        timeslot_id=timeslot_id
                    )
                    new_conflicts.append(conflict)
                    self._conflicts.append(conflict)
                
                self._schedule[day_id][timeslot_id].append(slot)
        
        return new_conflicts
    
    def add_events(self, events: List[Event]) -> List[Conflict]:
        """
        Add multiple events to the timetable.
        
        Args:
            events: List of Event objects to add
            
        Returns:
            List of all conflicts created
        """
        all_conflicts = []
        for event in events:
            conflicts = self.add_event(event)
            all_conflicts.extend(conflicts)
        return all_conflicts
    
    def get_conflicts(self) -> List[Conflict]:
        """Get all conflicts in the timetable."""
        return self._conflicts
    
    def has_conflicts(self) -> bool:
        """Check if the timetable has any conflicts."""
        return len(self._conflicts) > 0
    
    def get_slots_for_day(self, day_id: int) -> Dict[int, List[TimetableSlot]]:
        """
        Get all slots for a specific day.
        
        Args:
            day_id: Day ID (1=Monday, 2=Tuesday, etc.)
            
        Returns:
            Dictionary mapping timeslot_id to list of TimetableSlots
        """
        return self._schedule.get(day_id, {})
    
    def get_slot(self, day_id: int, timeslot_id: int) -> List[TimetableSlot]:
        """
        Get slots at a specific day and timeslot.
        
        Args:
            day_id: Day ID (1=Monday, etc.)
            timeslot_id: Timeslot ID
            
        Returns:
            List of TimetableSlots at that position (empty if none)
        """
        return self._schedule.get(day_id, {}).get(timeslot_id, [])
    
    def get_events(self) -> List[Event]:
        """Get all events in the timetable."""
        return self._events
    
    def to_dict(self) -> Dict:
        """
        Convert timetable to a dictionary representation.
        
        Returns:
            Dictionary with timetable data
        """
        result = {}
        for day_id, day_name in self.DAY_NAMES.items():
            result[day_name] = {}
            day_slots = self._schedule.get(day_id, {})
            for timeslot_id in sorted(day_slots.keys()):
                time_desc = self.TIMESLOTS.get(timeslot_id, f"Slot {timeslot_id}")
                slots = day_slots[timeslot_id]
                result[day_name][time_desc] = [
                    {
                        "event_name": slot.event.name,
                        "course_id": slot.event.course_id,
                        "rooms": slot.rooms,
                        "event_id": slot.event.event_id
                    }
                    for slot in slots
                ]
        return result
    
    def __repr__(self) -> str:
        event_count = len(self._events)
        conflict_count = len(self._conflicts)
        return f"Timetable({event_count} events, {conflict_count} conflicts)"

    @staticmethod
    def get_event_slots(event: Event) -> List[Tuple[int, int]]:
        """Extract (day_id, timeslot_id) tuples for an event."""
        slots = []
        for day_event in event.days:
            if isinstance(day_event, dict):
                day_id = day_event['day']['day_id']
                start_slot = day_event['start_time']['timeslot_id']
                end_slot = day_event['end_time']['timeslot_id']
            else:
                day_id = day_event.day.day_id
                start_slot = day_event.start_time.timeslot_id
                end_slot = day_event.end_time.timeslot_id
            
            for timeslot_id in range(start_slot, end_slot + 1):
                slots.append((day_id, timeslot_id))
        return slots
    
    def to_grid(self) -> List[List[str]]:
        """
        Convert timetable to a 2D grid representation for display.
        
        Returns:
            2D list where rows are timeslots and columns are days.
            First row is headers, first column is time.
        """
        # Find all used timeslots
        used_timeslots = set()
        for day_id in self._schedule:
            used_timeslots.update(self._schedule[day_id].keys())
        
        if not used_timeslots:
            return [["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]]
        
        min_slot = min(used_timeslots)
        max_slot = max(used_timeslots)
        
        # Header row
        grid = [["Zeit", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]]
        
        # Data rows
        for timeslot_id in range(min_slot, max_slot + 1):
            row = [self.TIMESLOTS.get(timeslot_id, f"Slot {timeslot_id}")]
            for day_id in range(1, 6):
                slots = self.get_slot(day_id, timeslot_id)
                if slots:
                    cell = " / ".join([s.event.name for s in slots])
                    if len(slots) > 1:
                        cell = f"⚠️ {cell}"  # Mark conflicts
                else:
                    cell = ""
                row.append(cell)
            grid.append(row)
        
        return grid
    
    def print_timetable(self):
        """Print a formatted timetable to console."""
        grid = self.to_grid()
        
        # Calculate column widths
        col_widths = []
        for col in range(len(grid[0])):
            max_width = max(len(str(row[col])) for row in grid)
            col_widths.append(max(max_width, 10))
        
        # Print header
        header = " | ".join(
            str(grid[0][i]).center(col_widths[i]) 
            for i in range(len(grid[0]))
        )
        print(header)
        print("-" * len(header))
        
        # Print rows
        for row in grid[1:]:
            row_str = " | ".join(
                str(row[i]).ljust(col_widths[i]) 
                for i in range(len(row))
            )
            print(row_str)

    @staticmethod
    def get_max_conflict_free_timetables(events: List[Event]) -> List['Timetable']:
        """
        Get conflict-free timetables with the maximum number of events.
        
        This method first creates a full timetable to identify all conflicts,
        then builds a conflict graph and finds maximum independent sets
        (combinations of events with no conflicts between them).
        
        Args:
            events: List of Event objects to consider
            
        Returns:
            List of Timetable objects with maximum events (no conflicts)
        """
        if not events:
            return []
        
        conflict_graph: Dict[int, set] = {i: set() for i in range(len(events))}
        
        event_slots: Dict[int, set] = {}
        for i, event in enumerate(events):
            event_slots[i] = set(Timetable.get_event_slots(event))
        
        # Find all conflicts between events
        for i in range(len(events)):
            for j in range(i + 1, len(events)):
                # Check if events i and j share any timeslot
                if event_slots[i] & event_slots[j]:  # Set intersection
                    conflict_graph[i].add(j)
                    conflict_graph[j].add(i)
        
        # Find events with no conflicts - they must be in every solution
        no_conflict_events = [i for i in range(len(events)) if not conflict_graph[i]]
        conflicting_events = [i for i in range(len(events)) if conflict_graph[i]]
        
        if not conflicting_events:
            # No conflicts at all, return single timetable with all events
            return [Timetable(events)]
        
        max_size = 0
        max_combinations: List[List[int]] = []
        
        def backtrack(index: int, current: List[int], excluded: set):
            nonlocal max_size, max_combinations
            
            # Calculate maximum possible size from this point
            remaining = len(conflicting_events) - index
            potential_max = len(current) + remaining
            
            # Prune: can't beat current max
            if potential_max < max_size:
                return
            
            # Check if current combination is valid (no internal conflicts)
            if len(current) > max_size:
                max_size = len(current)
                max_combinations = [current.copy()]
            elif len(current) == max_size and current:
                max_combinations.append(current.copy())
            
            # Try adding more events
            for i in range(index, len(conflicting_events)):
                event_idx = conflicting_events[i]
                
                # Skip if this event conflicts with any already selected
                if event_idx in excluded:
                    continue
                
                # Add this event and its conflicts to excluded set
                new_excluded = excluded | conflict_graph[event_idx]
                current.append(event_idx)
                backtrack(i + 1, current, new_excluded)
                current.pop()
        
        backtrack(0, [], set())
        
        # Build timetables from the maximum combinations
        result = []
        seen = set()
        
        for combination in max_combinations:
            # Add the no-conflict events to each combination
            full_combination = no_conflict_events + combination
            
            # Create hashable key to avoid duplicates
            key = tuple(sorted(full_combination))
            if key in seen:
                continue
            seen.add(key)
            
            # Create timetable with the selected events
            selected_events = [events[i] for i in full_combination]
            timetable = Timetable(selected_events)
            result.append(timetable)
        
        return result