import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";

const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function Register(){

    const navigate = useNavigate();

    const {register,handleSubmit,formState:{errors},setError} = useForm();


    const onSubmit = async(data)=>{
        if(data.password !== data.checkPassword){
            setError('checkPassword',{
                type: "manual", // 手動設置錯誤
                message: "密碼和確認密碼不一致",
            })
            return;
        }
        try {
            const res = await axios.post(`${api_Path}/register`,{
                email:data.email,
                password:data.password,
                name:data.name,
                phone:data.phone,
                birthday:data.birthday,
                LineID:data.LineID,
                user:'user'
            });
            navigate('/login');
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return <div className="container">
        <h4 className="text-center mt-5">這是register頁面</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5">
            <label htmlFor="email" className="form-label">帳號</label>
            <input type="email" placeholder="請輸入信箱作為註冊帳號" id='email' className="form-control"
                {...register('email',{
                    required:'請輸入信箱作為註冊帳號',
                    pattern:{
                        value:/^[a-zA-Z0-9._]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message:'＊請輸入有效的信箱格式'
                    }
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.email ? errors.email.message : ''}
            </div>
            <label htmlFor="password" className="form-label">密碼</label>
            <input type="text" placeholder="請輸入註冊密碼" id='password' className="form-control"
                {...register('password',{
                    required:'請輸入註冊密碼',
                    pattern:{
                        value:/^(?=.*[A-Za-z])(?=(.*\d){8,}).+$/,
                        message:'＊密碼必須包含一個英文字元＋八位數字'
                    }
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.password ? errors.password.message : ''}
            </div>
            <label htmlFor="checkPassword" className="form-label">確認密碼</label>
            <input type="text" placeholder="請確認註冊密碼" id='checkPassword' className="form-control"
                {...register('checkPassword',{
                    required:'請確認輸入密碼'
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.checkPassword ? errors.checkPassword.message : ''}
            </div>
            <label htmlFor="name" className="form-label">姓名</label>
            <input type="text" placeholder="請輸入姓名" id='name' className="form-control"
                {...register('name',{
                    required:'請輸入姓名'
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.name ? errors.name.message : ''}
            </div>
            <label htmlFor="phone" className="form-label">電話</label>
            <input type='tel' placeholder="請輸入註冊電話" id='phone' className="form-control"
                {...register('phone',{
                    required:'請輸入電話',
                    pattern:{
                        value:/^0\d{8,9}$/,
                        message:'＊電話必須為0開頭且9到10位數字'
                    }
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.phone ? errors.phone.message : ''}
            </div>
            <label htmlFor="birthday" className="form-label">生日</label>
            <input type="date" id='birthday' className="form-control" min="1925-01-01" max="2015-12-31"
                {...register('birthday',{
                    required:'請選擇生日'
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.birthday ? errors.birthday.message : ''}
            </div>
            <label htmlFor="LineID" className="form-label">LINEID</label>
            <input type="text" placeholder="請輸入LineID，供聯絡用" id='LineID' className="form-control"
                {...register('LineID',{
                    required:'請輸入LineID，供聯絡用'
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.LineID ? errors.LineID.message : ''}
            </div>
            <button type="submit" className="btn btn-primary btn-lg mt-5 ">註冊</button>
        </form>
    </div>
}