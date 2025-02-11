import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function Login(){
    
    const navigate = useNavigate();

    const {register,handleSubmit,formState:{errors}} = useForm();


    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        loginCheck();
    }, []);

    const loginCheck = async()=>{
        try {
            const res = await axios.get(`${api_Path}/login/check`);
            alert('登入成功，即將跳轉頁面');
            if(res.data.user.user==='admin'){
                navigate('/admin');
            }else{
                navigate('/member/center');
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    
    const onSubmit = async(data)=>{
        try {
            const res = await axios.post(`${api_Path}/login`,{
                email:data.email,
                password:data.password,
            });
            document.cookie = `token=${res.data.token};`;
            axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
            loginCheck();
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return <div className="container">
        <h4 className="text-center mt-5">這是login頁面</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5">
            <label htmlFor="email" className="form-label">帳號</label>
            <input type="email" placeholder="請輸入帳號" id='email' className="form-control"
                {...register('email',{
                    required:'請輸入帳號',
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
            <input type="text" placeholder="請輸入密碼" id='password' className="form-control"
                {...register('password',{
                    required:'請輸入密碼'
                })}
            />
            <div className="my-2 ms-1 text-danger">
                {errors.password ? errors.password.message : ''}
            </div>
            <button type="submit" className="btn btn-primary btn-lg mt-5 ">登入</button>
        </form>
    </div>
}