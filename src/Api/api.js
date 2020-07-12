export const API_URL = "https://api.themoviedb.org/3";

export const API_KEY_3 = 'f1d86a309cc8ebfc440c9e6ada4c9152';

export const API_KEY_4 = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWQ4NmEzMDljYzhlYmZjNDQwYzllNmFkYTRjOTE1MiIsInN1YiI6IjVlZjUyMmZhZDEwMGI2MDAzNGRiNDYyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNzWoHjyID27tUO46OgmJVOCv67v5upBH_zhL3Poxc8';

export const fetchAPI = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        fetch(url, options)
        .then(response => {
            if (response.status < 400){
                return response.json()
            } else {
                throw response
            }
        })
        .then(data => resolve(data))
        .catch(response => {
            response.json()
                .then(error => reject(error))
        })
    })
}