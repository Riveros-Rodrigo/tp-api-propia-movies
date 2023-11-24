const db = require('../database/models')
const createError = require('http-errors')

const getAllMovies = async (limit, offset) => { //funcion asincronica, no puede haber aewit sin async


    try {
        const movies = await db.Movie.findAll({
            limit, //cantidad de elemntos que quiero que traiga
            offset, // lo que me saltee
            attributes :{
                exclude : ['created_at','updated_at','genre_id'] //de la tabla genre que me excluya solo el createdAt y updatedAt
            },
            include : [
                {
                    association : 'genre',
                    attributes: ['id', 'name'] //de la tabla genre que me incluya solo el id y name
                },
                {
                    association : 'actors',
                    attributes: ['id','first_name','last_name']
                }
            ]
        })

        const total = await db.Movie.count()

        return {
            movies,
            total
        }
    } catch (error) {
        console.log(error);
        throw {
            status : 500 , //errores 500 son errores del sv
            message: error.message 
        }
    }
}

const getMovieById = async (id) =>{
    try {
        if(!id) throw createError(400, 'ID inexistente')
        const movie = await db.Movie.findByPk(id,{
            attributes :{
                exclude : ['created_at','updated_at','genre_id'] //de la tabla genre que me excluya solo el createdAt y updatedAt
            },
            include : [
                {
                    association : 'genre',
                    attributes: ['id', 'name'] //de la tabla genre que me incluya solo el id y name
                },
                {
                    association : 'actors',
                    attributes: ['id','first_name','last_name'],
                    through : {
                        attributes : []
                    }
                }
            ]
        })

        if(!movie) throw createError(404, 'No existe una pelÍcula con ese ID')

        return movie
    } catch (error) {
        console.log(error);
        throw {
            status : error.status || 500 , //errores 500 son errores del sv
            message: error.message || 'Upss, hubo un error'
        }
    }
}

const createMovie = async (dataMovie, actors) =>{
    try {
        const newMovie = await db.Movie.create(dataMovie);

        if(actors){
            const actorsDB = actors.map(actor =>{
                return {
                    movie_id : newMovie.id,
                    actor_id : actor
                };
            })
            await db.Actor_Movie.bulkCreate(actorsDB,{
                validate : true
            })
        }
        return newMovie


    } catch (error) {
        throw {
            status : error.status || 500 , //errores 500 son errores del sv
            message: error.message || 'Upss, hubo un error'
        }
    }
}

const updateMovie = async (id,dataMovie) =>{
    try {
        
        const {title, release_date, awards, rating, length, genre_id, actors} = dataMovie;

        const movie = await db.Movie.findByPk(id)

        movie.title = title || movie.title //si viene title guardamelo sino guardame lo que tiene
        movie.release_date = release_date || movie.release_date
        movie.awards = awards || movie.awards
        movie.rating = rating || movie.rating
        movie.length = length || movie.length
        movie.genre_id = genre_id || movie.genre_id

        await movie.save(); // con .save se guardan los datos actualizados

        if(actors){ //si viene actores destruimos lo siguiente y dsp lo volvemos a crear
            await db.Actor_Movie.destroy({
                where: {
                    movie_id : id
                }
            })

            const actorsArray = actors.map(actor =>{
                return{
                    movie_id : id,
                    actor_id : actor
                }
            })

            await db.Actor_Movie.bulkCreate(actorsArray,{
                validate : true
            })
        }

        return null

    } catch (error) {
        throw {
            status : error.status || 500 , //errores 500 son errores del sv
            message: error.message || 'Upss, hubo un error'
        }
    }
}

const deleteMovie = async (id) =>{
    try {
        
        await db.Actor_Movie.destroy({
            where : {
                movie_id : id
            }
        })

        const movie = await db.Movie.findByPk(id)
        await movie.destroy()

        return null

    } catch (error) {
        throw {
            status : error.status || 500 , //errores 500 son errores del sv
            message: error.message || 'Upss, hubo un error'
        }
    }
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
}