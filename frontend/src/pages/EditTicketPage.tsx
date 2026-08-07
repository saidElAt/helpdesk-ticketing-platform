import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import { getCategories } from '../api/categoryApi'
import {
  getTicketById,
  updateTicket,
} from '../api/ticketApi'
import type { Category } from '../types/category'
import type { TicketPriority } from '../types/ticket'

export default function EditTicketPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] =
    useState<Category[]>([])

  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [priority, setPriority] =
    useState<TicketPriority>('MEDIUM')

  const [categoryId, setCategoryId] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function loadData() {
      const ticketId = Number(id)

      if (
        !Number.isInteger(ticketId) ||
        ticketId <= 0
      ) {
        setError('Invalid ticket ID')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const [
          ticketResponse,
          categoryResponse,
        ] = await Promise.all([
          getTicketById(ticketId),
          getCategories(),
        ])

        setTitle(ticketResponse.title)
        setDescription(ticketResponse.description)
        setPriority(ticketResponse.priority)
        setCategoryId(
          String(ticketResponse.categoryId)
        )

        setCategories(
          categoryResponse.filter(
            (category) => category.enabled
          )
        )
      } catch (exception) {
        if (exception instanceof Error) {
          setError(exception.message)
        } else {
          setError('Could not load ticket')
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [id])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const ticketId = Number(id)

    if (
      !Number.isInteger(ticketId) ||
      ticketId <= 0
    ) {
      setError('Invalid ticket ID')
      return
    }

    if (!categoryId) {
      setError('Please select a category')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await updateTicket(
        ticketId,
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          categoryId: Number(categoryId),
        }
      )

      navigate(`/tickets/${ticketId}`)
    } catch (exception) {
      if (exception instanceof Error) {
        setError(exception.message)
      } else {
        setError('Could not update ticket')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="page-center">
        <p>Loading ticket...</p>
      </main>
    )
  }

  return (
    <main className="create-ticket-page">
      <section className="create-ticket-card">
        <div className="create-ticket-card__header">
          <p className="login-card__eyebrow">
            Helpdesk Ticketing Platform
          </p>

          <h1>Edit ticket</h1>

          <p>
            Update the ticket information below.
          </p>
        </div>

        {error && (
          <p
            className="login-form__error"
            role="alert"
          >
            {error}
          </p>
        )}

        <form
          className="create-ticket-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            minLength={5}
            maxLength={150}
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            minLength={10}
            maxLength={5000}
            rows={8}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
          />

          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as TicketPriority
              )
            }
          >
            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="CRITICAL">
              Critical
            </option>
          </select>

          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(
                event.target.value
              )
            }
            required
          >
            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>

          <div className="create-ticket-form__actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                navigate(`/tickets/${id}`)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}