import React, { useState } from 'react'

function Form (props) {
  const [person, setPerson] = useState({
    name: '',
    Classes: '',
    RoomNumbers: ''
  })

  function handleChange (event) {
    const { name, value } = event.target
    if (name === 'Classes') setPerson({ name: person.name, Classes: value, RoomNumbers: person.testThing })

    else if (name === 'name') setPerson({ name: value, Classes: person.Classes })
    else setPerson({ name: person.name, Classes: person.Classes, RoomNumbers: value })
  }

  function submitForm () {
    props.handleSubmit(person)
    setPerson({ name: '', Classes: '', RoomNumbers: '' })
  }

  return (
    <form>
      <label htmlFor='name'>Name</label>
      <input
        type='text'
        name='name'
        id='name'
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor='Classes'>Classes</label>
      <input
        type='text'
        name='Classes'
        id='Classes'
        value={person.Classes}
        onChange={handleChange}
      />
      <label htmlFor='Room Numbers'>Room Numbers</label>
      <input
        type='text'
        name='Room Numbers'
        id='Room Numbers'
        value={person.RoomNumbers}
        onChange={handleChange}
      />
      <input type='button' value='Submit' onClick={submitForm} />
    </form>
  )
}

export default Form
