import { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form"
import { UserContext } from "../components/userprovider";

const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function MemberData(){
    

    const {register,handleSubmit,formState:{errors},clearErrors} = useForm();

    const [isChanged,setIsChanged] = useState(false);

    const {user,updateUser} = useContext(UserContext);

    const stateChange = (e) => {
        e.preventDefault();  // 阻止預設行為
        clearErrors();
        setIsChanged(true);
    };
    

    const handleInputChange = (e)=>{
        const name = e.target.name;
        updateUser({ ...user, [name]: e.target.value });
    }
    
    const onSubmit = async()=>{
        try {
            const res = await axios.patch(`${api_Path}/members/update`,user);
            setIsChanged(false);
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return <>
        <h2>這是MemberData頁面</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5 row">
            <div className="col-6">
                <label htmlFor="name" className="form-label">姓名</label>
                <input type="text" placeholder="請輸入姓名" id='name' value={user.name} className="form-control" disabled={!isChanged} 
                    {...register('name',{
                        required:'請輸入姓名'
                    })}
                    onChange={(e)=>handleInputChange(e)}/>
                <div className="my-2 ms-1 text-danger">
                    {errors.name ? errors.name.message : ''}
                </div>
            </div>
            <div className="col-6">
                <label htmlFor="birthday" className="form-label">生日</label>
                <input type="date" id='birthday' className="form-control" value={user.birthday} min="1925-01-01" max="2015-12-31" disabled={!isChanged}
                    {...register('birthday',{
                        required:'請選擇生日'
                    })}
                    onChange={(e)=>handleInputChange(e)}/>
                <div className="my-2 ms-1 text-danger">
                    {errors.birthday ? errors.birthday.message : ''}
                </div>
            </div>
            <div className="col-12">
                <label htmlFor="email" className="form-label">帳號</label>
                <input type="email" placeholder="請輸入信箱作為帳號" id='email' 
                value={user.email} disabled={!isChanged}
                className="form-control"
                    {...register('email',{
                        required:'請輸入信箱作為帳號',
                        pattern:{
                            value:/^[a-zA-Z0-9._]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message:'＊請輸入有效的信箱格式'
                        }
                    })}
                    onChange={(e)=>handleInputChange(e)}/>
                <div className="my-2 ms-1 text-danger">
                    {errors.email ? errors.email.message : ''}
                </div>
            </div>
            <div className="col-6">
                <label htmlFor="phone" className="form-label">電話</label>
                <input type='tel' placeholder="請輸入電話" id='phone' 
                value={user.phone} disabled={!isChanged}
                className="form-control"
                    {...register('phone',{
                        required:'請輸入電話',
                        pattern:{
                            value:/^0\d{8,9}$/,
                            message:'＊電話必須為0開頭且9到10位數字'
                        }
                    })}
                    onChange={(e)=>handleInputChange(e)}/>
                <div className="my-2 ms-1 text-danger">
                    {errors.phone ? errors.phone.message : ''}
                </div>
            </div>
            <div className="col-6">
                <label htmlFor="LineID" className="form-label">LINEID</label>
                <input type="text" placeholder="請輸入LineID，供聯絡用" id='LineID' 
                value={user.LineID} disabled={!isChanged}
                className="form-control"
                    {...register('LineID',{
                        required:'請輸入LineID，供聯絡用'
                    })}
                    onChange={(e)=>handleInputChange(e)}/>
                <div className="my-2 ms-1 text-danger">
                    {errors.LineID ? errors.LineID.message : ''}
                </div>
            </div>
            <div className="row justify-content-center" >
                {isChanged
                    ?(<button type="submit" className="btn btn-primary btn-lg mt-5 col-4">完成編緝</button>)
                    :(<button type='button' className="btn btn-primary btn-lg mt-5 col-4" onClick={stateChange}>編輯資料</button>)
                }
            </div>
            
        </form>
    </>
}