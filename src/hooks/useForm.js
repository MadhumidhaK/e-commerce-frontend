import { useState } from 'react';

export const useForm = ( initialValues ={}, validate = () => {}, sucessCB = () => {}, errorCB = () => {}) => {
    const [values, setValues] = useState({
        ...initialValues
    });
    const [ responseStatusCode, setResponseStatusCode ] = useState(undefined);
    const [response, setResponse] = useState({});
    const [errors, setErrors] = useState({
        error: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { type, name } = e.target;
    
        const getValue = () => {
            if (type === 'checkbox') {
                return e.target.checked;
            }
            else if(type === "radio"){
                return e.target.value === true || e.target.value === 'true';
            }
            else if(type === "file" && e.target.files[0]){
                return e.target.files[0];
            }
            else if (type === 'select-multiple') {
                return Array.from(e.target.selectedOptions)
                    .map(o => o.value);
            }
            return e.target.value;
        }
        console.log(values)
        console.log(errors)
        const value = getValue();
        console.log("value")
        console.log(value)
        setErrors({
            ...errors,
            ...validate({param: name, value: value})
        });
        setValues({ ...values, [name]: value });
    };


    const handleSubmit = async (e, url, additionalHeaderOptions = {}, method = "POST", isMultiPartForm) => {
            console.log(additionalHeaderOptions)
            e.preventDefault();
            setIsLoading(true);
            console.log(values);
            console.log("values");
            let headerOptions =  {
                Accept: 'application/json',
                "Content-Type": "application/json",
                ...additionalHeaderOptions
            }
            let requestBody;
            if(isMultiPartForm){
                requestBody = new FormData();
                Object.entries(values).forEach((value) => {
                    requestBody.append(value[0], value[1])
                })
                headerOptions = {
                    ...additionalHeaderOptions
                }
            }else{
                requestBody = JSON.stringify(values);
            }

            const receivedResponse = await fetch(url,{
                                method: method,
                                headers: {
                                ...headerOptions
                                },
                                body: requestBody
                                
                            });
            setResponseStatusCode(receivedResponse.status);
            const res = await receivedResponse.json();
            setIsLoading(false);
            console.log(res)
            if(!res.error){
                setResponse(res);
                return sucessCB(res);
            }

            if(res.data && Array.isArray(res.data)){
                const resErorrs = res.data.reduce((acc, e) => ({...acc, [e.param] : e.msg}), {});
                setErrors({
                    error: "",
                    ...resErorrs
                })
            }else{
                setErrors({
                    ...res
                })
            }
            return errorCB(res, receivedResponse.status);
    };

    return {
        values,
        setValues,
        handleChange,
        handleSubmit,
        responseStatusCode,
        response,
        errors,
        isLoading
    }
}