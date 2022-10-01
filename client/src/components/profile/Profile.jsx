import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteAvatar, uploadAvatar, deleteUser} from "../../actions/user";
import  avatarus from '../../assets/img/avatar.svg'
import {API_URL} from "../../config"

const Profile = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)
    function changeHandler(e) {
        const file = e.target.files[0]
        dispatch(uploadAvatar(file))
    }

    return (
<div>
   <div className='Profile_user'>
     <img className='Profile_img' src= {currentUser.avatar ?
      `${API_URL + currentUser.avatar}`  : avatarus  }  alt=''/>
     <button className="disk__back" onClick={() => dispatch(deleteAvatar())}>Delete avatar</button>
  </div>
    <input accept="image/*"  className="disk__back" onChange={e => changeHandler(e)}
       type="file" placeholder="Загрузить аватар"/>
  <button className="Profile_delete" onClick={() => dispatch(deleteUser(currentUser))}>Delete user</button>
</div>
    );
};

export default Profile;
