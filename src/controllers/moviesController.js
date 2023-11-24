const createError = require('http-errors')
const paginate = require('express-paginate');
const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../services/movies.services');

const moviesController = {
    list: async (req, res) => {
        try {
            const {movies, total} = await getAllMovies(req.query.limit, req.skip);
            const pagesCount = Math.ceil(total / req.query.limit);
            const currentPage = req.query.page;
            const pages = paginate.getArrayPages(req)(pagesCount,pagesCount,currentPage)

            return res.status(200).json({  //positivo
                ok : true,
                meta : {
                    total,
                    pagesCount,
                    currentPage,
                    pages
                },
                data: movies //mando las pelis
            }) 
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error : error.message || 'Upss, hubo un error :('
            })
        }

        
    },
    detail: async (req, res) => {
        try {
            const movie = await getMovieById(req.params.id);
            return res.status(200).json({  //positivo
                ok : true,
                data: movie //mando las pelis
            }) 
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error : error.message || 'Upss, hubo un error :('
            })
        }
    },
    create: async (req, res) => {

        try {

            const {title, release_date, awards, rating, length, genre_id, actors} = req.body;

            if([title, release_date, awards, rating].includes('' || undefined)){
                throw createError(400, 'Los campos title, release_date, awards y rating son obligatorios')
            }

            const newMovie = await createMovie({
                title,
                release_date,
                awards,
                rating,
                length,
                genre_id
            },actors);

            return res.status(200).json({  //positivo
                ok : true,
                msg: 'Pelicula creada con éxito', //mando la peli nueva
                url: `${req.protocol}://${req.get('host')}/api/v1/movies/${newMovie.id}`
            }) 
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error : error.message || 'Upss, hubo un error :('
            })
        }
    },
    update: async (req,res) => {
        try {
            
            const movieUpdated = await updateMovie(req.params.id, req.body )

            return res.status(200).json({  //positivo
                ok : true,
                msg: 'Pelicula actualizada con éxito', //mando la peli nueva,
                url: `${req.protocol}://${req.get('host')}/api/v1/movies/${movieUpdated.id}`
            }) 

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error : error.message || 'Upss, hubo un error :('
            })
        }
    },
    destroy: async (req,res) => {
        try {
            
            await deleteMovie(req.params.id)
            return res.status(200).json({  //positivo
                ok : true,
                msg: 'Película eliminada con éxito', //mando la peli nueva,
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                error : error.message || 'Upss, hubo un error :('
            })
        }
    }
}

module.exports = moviesController;