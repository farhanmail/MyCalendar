import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Calendar () {
    const [openDialog, setOpenDialog]=useState(false);
    const [detailEvent, setDetailEvent] = useState()
    const handleDateClick = (event) => {
        setOpenDialog(true);
        setDetailEvent(event.dayEl.textContent)
        console.log(event.dayEl.textContent);
    }

    const [location, setLocation] = useState({
        coordinates: { lat: "", lng: ""}
    });

    const [idCountry, setIdCountry] = useState([])
    const [holiday, setHoliday] = useState([])

    const onSuccess = (location) => {
        setLocation({
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            }
        })
        fetchData(location)
    };
    
    const onError = error => {
        setLocation({
            error,
        })
    };

    useEffect(() => {
        if( !("geolocation" in navigator) ){
            onError({
                code: 0,
                message: "Geolocation Error",
            })
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }, []);

    const fetchData = (location) => {
        const d = new Date();
        axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&limit=5&appid=709fa7c040f91716528ed153e06fe784`)
        .then((res)=>{
            axios.get(`https://date.nager.at/api/v3/publicholidays/${d.getFullYear()}/${res.data[0].country}`)
            // axios.get(`https://holidays.abstractapi.com/v1/?api_key=bc9d6d73d4e244f0a7cf8960e3210547&country=${res.data[0].country}`)
            .then((res)=>{
                res.data.forEach((o, key)  => {
                    res.data[key].title = o.localName
                });
                setHoliday(res.data)
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
            setIdCountry(res.data)
            console.log(res);
        })
        .catch((err) => {
            console.log(err)
        });
    }
    return (
        <>
            <div>
                <div className='calender' style={{marginLeft:'10%', marginRight:'10%', height: '90vh'}}>
                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        events={holiday}
                    />

                </div>

            </div>
        </>
    )
}

export default Calendar;