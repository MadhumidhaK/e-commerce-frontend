
const fetchPost = async (url, values, additionalHeaderOptions, sucessCB, errorCB, method="POST", isMultiPartForm) => {
    try {
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
    
        const statusCode = receivedResponse.status;
    
        const res = await receivedResponse.json();
        if(!res.error){
            return sucessCB(res);
        }
    
        return errorCB(res, receivedResponse.status);
    } catch (error) {
        
    }
}


export default fetchPost;