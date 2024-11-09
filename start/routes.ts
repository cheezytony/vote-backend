import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProfileController = () => import('#controllers/profile_controller')
const PollsController = () => import('#controllers/polls_controller')
const SessionController = () => import('#controllers/session_controller')
const RegisterController = () => import('#controllers/register_controller')
const PollOptionsController = () => import('#controllers/poll_options_controller')
const VotesController = () => import('#controllers/votes_controller')

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [RegisterController, 'store']).as('register')
router.post('/login', [SessionController, 'store']).as('login')

router
  .group(() => {
    router.get('/', [ProfileController, 'index']).as('show')
    router.put('/', [ProfileController, 'update']).as('update')
  })
  .as('profile')
  .prefix('/me')
  .use(middleware.auth())

router
  .resource('poll', PollsController)
  .apiOnly()
  .except(['destroy'])
  .use(['store', 'update'], middleware.auth())
  .as('polls')

router
  .resource('poll.option', PollOptionsController)
  .apiOnly()
  .use(['destroy', 'store', 'update'], middleware.auth())
  .params({
    poll: 'pollId',
  })
  .as('polls.options')

router
  .resource('poll.vote', VotesController)
  .apiOnly()
  .except(['destroy'])
  .use(['store', 'update'], middleware.auth())
  .params({
    poll: 'pollId',
  })
  .as('polls.votes')
