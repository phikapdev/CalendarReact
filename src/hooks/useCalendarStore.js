import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi"
import Swal from 'sweetalert2';
import { convertEventToDateEvents } from "../helpers"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar"

export const useCalendarStore = () => {

  const dispatch = useDispatch()

  const { events, activeEvent } = useSelector( state => state.calendar)
  const { user } = useSelector( state => state.auth)

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent))
  }

  const startSavingEvent = async(calendarEvent) => {

    try {
      if(calendarEvent.id){
        //Actualizar
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)
        dispatch(onUpdateEvent({...calendarEvent, user}))
      }else{
        //Crear
        const { data } = await calendarApi.post('/events',calendarEvent)
        dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error al Guardar', error.response.data.msg, 'error')
    }
  }

  const startDeletingEvent = async() => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`)
      dispatch(onDeleteEvent())
    } catch (error) {
      console.log(error);
      Swal.fire('Error al Eliminar', error.response.data.msg, 'error')
    }
  }

  const startLoadingEvents = async() => {
    try {
      
      const {data} = await calendarApi.get('/events')
      const events = convertEventToDateEvents(data.eventos)

      dispatch(onLoadEvents(events))

    } catch (error) {
      console.log('Error Cargando Eventos');
      console.log(error);
    }
  }

  return {
    activeEvent,
    events,
    hasEventSelected: !!activeEvent,

    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
  }
}
