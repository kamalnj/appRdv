import React, { useMemo, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

interface RDVCalendarProps {
  rdvsIndisponibles: string[];
  commercantName: string;
  onDateSelect?: (dateInfo: any) => void;
  onEventClick?: (eventInfo: any) => void;
}

const RDVCalendar: React.FC<RDVCalendarProps> = ({ 
  rdvsIndisponibles, 
  commercantName,
  onDateSelect,
  onEventClick 
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // Convert rdvsIndisponibles to FullCalendar events format
  const events = useMemo(() => {
    return rdvsIndisponibles.map((rdv, index) => {
      const startDate = new Date(rdv);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assume 1 hour duration
      
      return {
        id: `rdv-${index}`,
        title: 'RDV Réservé',
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        textColor: '#ffffff',
        classNames: ['rdv-event'],
        extendedProps: {
          type: 'booked',
          commercant: commercantName
        }
      };
    });
  }, [rdvsIndisponibles, commercantName]);

  // Handle date selection
  const handleDateSelect = (selectInfo: any) => {
    const selectedDate = selectInfo.start;
    const now = new Date();
    
    // Check if selected date is in the past
    if (selectedDate < now) {
      alert('Impossible de sélectionner une date dans le passé');
      return;
    }

    // Check if there's already an appointment at this time
    const isBooked = rdvsIndisponibles.some(rdv => {
      const bookedDate = new Date(rdv);
      return Math.abs(bookedDate.getTime() - selectedDate.getTime()) < 60 * 60 * 1000; // Within 1 hour
    });

    if (isBooked) {
      alert('Ce créneau est déjà réservé, veuillez en choisir un autre.');
      return;
    }

    if (onDateSelect) {
      onDateSelect(selectInfo);
    }
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    if (onEventClick) {
      onEventClick(clickInfo);
    } else {
      // Default behavior - show event details
      const eventDate = new Date(clickInfo.event.start);
      alert(`RDV réservé le ${eventDate.toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short'
      })}`);
    }
  };

  return (
    <div className="rdv-calendar-container">
      <style>{`
        .rdv-calendar-container .fc {
          font-family: inherit;
        }
        
        .rdv-calendar-container .fc-toolbar {
          margin-bottom: 1rem;
        }
        
        .rdv-calendar-container .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
        }
        
        .rdv-calendar-container .fc-button {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: white;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .rdv-calendar-container .fc-button:hover:not(:disabled) {
          background-color: #2563eb;
          border-color: #2563eb;
          transform: translateY(-1px);
        }
        
        .rdv-calendar-container .fc-button:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        .rdv-calendar-container .fc-button-active {
          background-color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
        }
        
        .rdv-calendar-container .fc-daygrid-day {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .rdv-calendar-container .fc-daygrid-day:hover {
          background-color: #f3f4f6;
        }
        
        .rdv-calendar-container .fc-day-today {
          background-color: #dbeafe !important;
          border: 2px solid #3b82f6;
        }
        
        .rdv-calendar-container .rdv-event {
          cursor: pointer;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .rdv-calendar-container .rdv-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        
        .rdv-calendar-container .fc-timegrid-slot {
          height: 2rem;
        }
        
        .rdv-calendar-container .fc-col-header-cell {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
          border-color: #e5e7eb;
        }
        
        .rdv-calendar-container .fc-scrollgrid {
          border-color: #e5e7eb;
        }
        
        .rdv-calendar-container .fc-daygrid-day-frame,
        .rdv-calendar-container .fc-timegrid-slot {
          border-color: #f3f4f6;
        }

        .rdv-calendar-container .fc-popover {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Planning de {commercantName}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span>Aujourd'hui</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>RDV programmés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Disponible</span>
            </div>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={frLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour'
          }}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '08:00',
            endTime: '18:00'
          }}
          eventDisplay="block"
          dayHeaderFormat={{ weekday: 'short' }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          nowIndicator={true}
          selectConstraint={{
            start: new Date().toISOString().split('T')[0] + 'T08:00:00',
            end: '23:59:59'
          }}
        />
      </div>
    </div>
  );
};

export default RDVCalendar;