import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createDir, getFiles, uploadFile} from "../../actions/file";
import FileList from "./fileList/FileList";
import './disk.css'
import Popup from "./Popup";
import {setCurrentDir, setFileView, setPopupDisplay} from "../../reducers/fileReducer";
import Uploader from "./uploader/Uploader";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const loader = useSelector(state => state.app.loader)
    const dirStack = useSelector(state => state.files.dirStack)
    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState('type')

    useEffect(() => {
        dispatch(getFiles(currentDir, sort))
    }, [currentDir, sort])

    function showPopupHandler() {
        dispatch(setPopupDisplay('flex'))
    }
    function backClickHandler() {
        const backDirId = dirStack.pop()
        dispatch(setCurrentDir(backDirId))
    }
    function fileUploadHandler(event) {
              const files = [...event.target.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
    }
    function dragEnterHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }
    function dragLeaveHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }
    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
        setDragEnter(false)
    }

    if(loader) {
        return (
            <div className="loader">
                <div className="lds-dual-ring"></div>
            </div>
        )
    }

    return ( !dragEnter ?
            <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                <div className="disk__btns">
  {!currentDir ? '' :
  <button className="disk__back" onClick={() => backClickHandler()}>Get Back</button>}
  <TransitionGroup>
  <CSSTransition  timeout={500}  classNames={'file'}
      //exit={false}
  >
  <button className="disk__create" onClick={() => showPopupHandler()}>Create folder</button>
  </CSSTransition >
  </TransitionGroup>
                    <div className="disk__upload">
  <label htmlFor="disk__upload-input" className="disk__upload-label">Upload file</label>
  <input multiple={true} onChange={(event)=> fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
                    </div>
                <select value={sort} placeholder='op'
                            onChange={(e) => setSort(e.target.value)}
                            className='disk__select'>
                        <option value="name">Filter by name</option>
                        <option value="type">Filter by type</option>
                        <option value="date">Filter by date</option>
                </select>
  <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))}/>
  <button className="disk__list" onClick={() => dispatch(setFileView('list'))}/>
                       </div>
                <FileList/>
                <Popup/>
                <Uploader/>
            </div>
            :
            <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                Перетащите файлы сюда
            </div>
    );
};

export default Disk;
