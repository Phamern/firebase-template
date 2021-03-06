import React, { useState, useEffect } from "react"
import firebase from "./firebase"
import "./Edit.css"
import {MdKeyboardBackspace} from 'react-icons/md'
import FileUploader from 'react-firebase-file-uploader'
import { Link } from '@reach/router'

const Edit = props => {
  const [project, setProject] = useState()
  const [status, setStatus] = useState('')
  const [imageName, setImageName] = useState('defaultImage')

  //første som skjer i et komponenet
  useEffect(() => {
    firebase
      .firestore()
      .collection("projects")
      .doc(props.id)
      .onSnapshot(snapshot =>
        //returnerer rent JSON obj
        setProject(snapshot.data())
      );
  }, [props.id])

  const saveProject = () => {}

  const updateValue = 
    e => {
    e.persist();
      switch(e.target.type) {
        case 'checkbox': {
            setProject(
              existingProject => ({
              ...existingProject,
              [e.target.name]: e.target.value
          }))
          break;
          }
        case 'text': {
          setProject(
            existingProject => ({
            ...existingProject,
            [e.target.name]: e.target.value
          }))
          break;
        }
        default: {
          setProject(
            existingProject => ({
            ...existingProject,
            [e.target.name]: e.target.value
          }))
        }
      }
    }

  const submitChanges = (e) => {
    setStatus('Updating project, please hold')
    e.preventDefault()
    firebase.firestore().collection('projects').doc(props.id)
      .update(project)
      .then(() => setStatus('Project updated'))
      .catch(error => console.log(error.message))
  }

  const uploadStart = () => {
    setStatus('uploading image, please hold')
  }

  const uploadError = (error) => {
    setStatus(error)
  }

  const handleProgress = (percentage) => {
    console.log(percentage)
  }

 const uploadSuccess = (filename) => {
    firebase
    .storage()
    .ref('images')
    .child(filename)
    .getDownloadURL()
    .then(
      url => setProject( existingProject => ( {
        ...existingProject,
        [imageName]: url
      } ) )
    )
    setStatus('Image uploaded')
  }

  return (
    <main className='edit'>
       <div>
        <Link className='back-button' to={process.env.PUBLIC_URL + '/projects'}>
          <MdKeyboardBackspace className='back-icon'/>
        </Link>
        </div>
      {
        project ?
        <>
        <h1>Edit Project : {project.title}</h1>
        <form onSubmit={saveProject}>
          <input
            onChange={updateValue}
            name="orderNr"
            value={project.orderNr}
            placeholder="Order by number"
          />
        <p>Title: </p>
          <input
            onChange={updateValue}
            name="title"
            value={project.title}
            placeholder="Title"
          />
          <input 
            onChange={updateValue}
            name='year'
            value={project.year}
            placeholder='year'
            />
          <input 
            onChange={updateValue}
            name='type'
            value={project.type}
            placeholder='type'
            />
          <input 
            onChange={updateValue}
            name='tech'
            value={project.tech}
            placeholder='tech'
            />
          <input 
            onChange={updateValue}
            name='role'
            value={project.role}
            placeholder='role'
            />
          <input 
            onChange={updateValue}
            name='website'
            value={project.website}
            placeholder='website'
            />
          <input 
            onChange={updateValue}
            name='styleguide'
            value={project.styleguide}
            placeholder='styleguide'
            />
          <input 
            onChange={updateValue}
            name='byline'
            value={project.byline}
            placeholder='byline'
            />
          <div className='checkboxes'>
            <input name='published' id='published' type='checkbox' onChange={updateValue} defaultChecked={project.published}/>
          </div>
          <p>Description: </p>
          <textarea
            onChange={updateValue}
            name="description"
            value={project.description}
            placeholder="description"
          />
          <p>Concept: </p>
          <textarea
            onChange={updateValue}
            name="concept"
            value={project.concept}
            placeholder="concept"
          />
          <textarea
            onChange={updateValue}
            name="conceptName"
            value={project.conceptName}
            placeholder="concept name"
          />
          <p>Target Audience: </p>
          <textarea
            onChange={updateValue}
            name="audience"
            value={project.audience}
            placeholder="audience"
          />

          <div className='project-images'>
            {
              project.defaultImage &&
              <div>
                <p className='imageNameIndicator'>Default</p>
                <img src={project.defaultImage} alt='default' />
              </div>
            }
            {
              project.introImage &&
              <div>
                <p className='imageNameIndicator'>Intro Image</p>
                <img src={project.introImage} alt='intro' />
              </div>
            }
            {
              project.resultImage &&
              <div>
                <p className='imageNameIndicator'>Result Image</p>
                <img src={project.resultImage} alt='result' />
              </div>
            }
           </div>
          <select name='imageName' onChange={ e => setImageName(e.target.value)}>
            <option name='defaultImage' value='defaultImage'>Default Image</option>
            <option name='introImage' value='introImage'>Intro Image</option>
            <option name='resultImage' value='resultImage'>Result Image</option>
          </select>
          <label>
            <div className='uploadButton'>
              {/* {project.defaultImage ? 'upload image' : 'upload image'} */}
              upload image
            </div>
            <FileUploader
              hidden
              accept="image/*"
              storageRef={firebase.storage().ref('images')}
              onUploadStart={uploadStart}
              onUploadError={uploadError}
              onUploadSuccess={uploadSuccess}
              onProgress={handleProgress}
            />
          </label>
        </form>
        <button onClick={submitChanges}>
            <Link to={process.env.PUBLIC_URL + '/'}>
              Submit Changes
            </Link>
          </button>
        <p>{status}</p>
        </>
        : <h2>fetching...</h2>
      }
    </main>
  );
};

export default Edit;
