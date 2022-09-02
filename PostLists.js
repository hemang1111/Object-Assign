import { useSelector ,useDispatch } from "react-redux"
import React, { useEffect, useState } from 'react'
import { AllpostData, deletePost } from "./postSlice"
import {setProps , clearStatData} from './postSlice'
import { IISMethods } from "../../Config/IISMethods"
import { Config } from "../../Config/IISMethods"
import { SelectPicker } from 'rsuite'
import {AcUnitRounded , ListOutlined , Delete} from  "@material-ui/icons"


const PostLists = () => {
  
    const postdata = useSelector(AllpostData)
    const dispatch = useDispatch()

    console.log(postdata)

    const [showWelcomeMessage,setWelcomeMessage] = useState(false)
    const [preventReload , setPreventReload] = useState(0)


    const isFromDataEmpty = ()=>{
        console.log('isFromDataEmpty')
       let  isEmpty = true
        console.log(postdata.formData)
            Object.keys(postdata.formData).map( key =>{
                    console.log(postdata.formData[key].length)
                if(postdata.formData[key].length)
                    isEmpty = false
            })
            isEmpty = !Object.keys(postdata.formData).length ? true : isEmpty
            return !isEmpty && preventReload
    }

    window.onbeforeunload  = (event) =>{
        console.log('reload')
        
        if(isFromDataEmpty()){
            const e = event 
            e.preventDefault()
            if (e) {
                e.returnValue = ''; // Legacy method for cross browser support
            }
            return ''; // Legacy method for cross browser support
        }
      }

      useEffect(()=>{
        let tempObj = {}
        tempObj['image'] = [{'imgName' : '' , base : ''}]

        dispatch(setProps({formData : IISMethods.getCopy(tempObj)}))
        console.log(postdata.formData)
      },[])


      const lists = (e)=>{
        document.getElementById(`lists-${e.currentTarget.dataset.index}`).classList.toggle('display-none')
      }

    const RenderedPosts = (props)=>{
        return(
            props.postdata.map( (post,index) =>{
                return(
                    <article key={post.id+index} className="posts">
                        <div className="post-title">
                            <div>{post.title}</div>
                            <span onClick={(e)=>lists(e)} data-index={index}><ListOutlined/></span>
                            <div id={`lists-${index}`} className='display-none post-lists'>
                                <ul>
                                    <li className="text-center" onClick={()=>{deleteApplicationPost(post.id)}}><Delete/><span>Delete Post</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="post-desc">
                            <p>{post.content}</p>
                        </div>
                    </article>
                )
            })
        )   
    }

    const hanldeFormData = async (type,key,value)=>{
        let tempObj = JSON.parse(JSON.stringify(postdata.formData))
        
        if(type==='checkbox'){
            tempObj[key] = value ? 1 : 0
        }
        else if(type==='file'){

            if(value.target.files[0]){
                const File = value.target.files[0]
                var patternImage = /image-*/
                var patternApllicaiton = /application-*/
                // && !File.type.match(patternApllicaiton)
                if(!File.type.match(patternImage) && !scriptFile(value.target.files[0].name) ){
                    alert("invalid Format")
                }
                else if(parseInt(File.size)/1028 > Config.getMaxFileSizeInBytes()){
                    alert(`too large file size (should be less then 22kB) you file size is ${parseInt(File.size)/1028} KB`)
                }
                else {
                    tempObj[key][0]['imgName'] = value.target.files[0].name
                    tempObj[key][0]['base'] = await IISMethods.fileToBase64(value.target.files[0])
                }
            }
           
        }
        else
            tempObj[key] = value
        dispatch(setProps({formData : IISMethods.getCopy(tempObj)}))

        if(tempObj.checkbox == true){
            setWelcomeMessage(true)
            console.log(showWelcomeMessage)
        }
        else{
            setWelcomeMessage(false)
        }
    }


    const scriptFile = (fileName)=>{
        var fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi

        let fileExtension = fileName.match(fileExtensionPattern)[0]

        var allowedFiles = [".doc", ".docx", ".pdf",".xlsx",".pptx"]
        var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$")
        return regex.test("iis"+fileExtension)
    }

    const addPosts = ()=>{
        let tempObj = {
            id : '3',
            title : 'New Post Added',
            content : 'New Post added just now'
        }
        // console.log(Object.assign([],postdata.ApplicationData))
        // console.log(Object.assign([],postdata.ApplicationData).concat(tempObj))
        // , data : {name : 'shruti' , value : '30'} 
        let arr = IISMethods.getCopy(postdata.ApplicationData) 
        console.log(arr)
        arr.push(tempObj)   
        console.log(arr)
        dispatch(setProps({ApplicationData : arr }))    
    }

    const deleteApplicationPost =  (id)=>{
        dispatch(deletePost())
    }

    const getNetworkStatus = () =>{
        console.log(navigator.onLine)
        alert(navigator.onLine)
    }

    try{
        return(
            <>
            <section>
            <div className="form-header">
                <h2 className="add-post">Posts</h2>
            </div>
            <div className="posts-container">
                {<RenderedPosts postdata={postdata.ApplicationData}/>}
            </div>
               
                {/* <button onClick={()=>{addPosts()}}> Add Post + </button>
                <button onClick={()=>{deleteApplicationPost()}}> Delete Post - </button>
                <button onClick={()=>dispatch(clearStatData())}>clear data</button> */}
                
                
                <div className="html-controll">
                    <div>
                        <input type='checkbox' checked={preventReload} onChange={(e)=>{setPreventReload(e.target.checked ? 1 : 0)}}></input>
                        <label>stop page reloading..</label>
                    </div>
                    <div>
                        <label>Upload Image</label>
                        <input type='file' onChange={(e)=>hanldeFormData('file','image',e)} 
                        name="stampfile"
                        id="sampfile"
                        ></input>
                        {/* <span>{postdata.formData['image'] ? postdata.formData['image'].length ? postdata.formData['image'][0]['imgName'] ? postdata.formData['image'][0]['imgName']: '' : '' : ''}</span> */}
                        <span  htmlFor="stampfile">
                            {/* <img  id="stampfilepreviewimg" src={postdata.formData['image'][0]['base']} alt="img"/> */}
                        </span>
                    </div>
                    <button onClick={()=>{document.getElementById('sampfile').value = ''}}>Hide</button>
                    <SelectPicker  cleanable={true}  searchable={true} 
                        data={[{"label" : "1" , "value" : 1}]}  value={''}
                        // onSelect={props.onSelect}
                        // placement={props.placement}
                        // placeholder={props.placeholder}
                        // onClean={props.onClean}
                        // onChange={props.onChange}
                        // defaultValue={props.defaultValue}
                        // disabled={props.disabled}
                        // disabled={props.disabled}
                        // defaultValue={props.defaultValue}
                        trigger = {['Space']}
                        onOpen={()=>{}}
                    >
                    </SelectPicker>
                </div>  
            </section>
            </>
        )
    }
    catch(e){
        console.log(e)
        return <></>
    }
}

export default PostLists