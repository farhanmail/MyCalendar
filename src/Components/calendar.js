import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import React from 'react';


function Calendar () {
    return (
        <>
            <div>
                <div className='calender' style={{marginLeft:'10%', marginRight:'10%', height: '90vh'}}>
                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        weekends={false}
                        events={[
                            { title: 'event 1', date: '2019-04-01' },
                            { title: 'event 2', date: '2019-04-02' }
                        ]}
                    />

                </div>

            </div>
        </>
    )
}

export default Calendar;