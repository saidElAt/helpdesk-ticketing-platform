import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../api/categoryApi'
import { createTicket } from '../api/ticketApi'
import type { Category } from '../types/category'
import type { TicketPriority } from '../types/ticket'

export default function CreateTicketPage() {
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

  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true)
      setError('')

      try {
        const response =
          await getCategories()

        const enabledCategories =
          response.filter(
            (category) => category.enabled
          )

        setCategories(enabledCategories)

        if (enabledCategories.length > 0) {
          setCategoryId(
            String(enabledCategories[0].id)
          )
        }
      } catch (exception) {
        if (exception instanceof Error) {
          setError(exception.message)
        } else {
          setError(
            'Could not load categories'
          )
        }
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!categoryId) {
      setError(
        'Please select a category'
      )
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryId: Number(categoryId),
      })

      navigate('/tickets')
    } catch (exception) {
      if (exception instanceof Error) {
        setError(exception.message)
      } else {
        setError(
          'Could not create ticket'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="create-ticket-page">
      <section className="create-ticket-card">
        <div className="create-ticket-card__header">
          <p className="login-card__eyebrow">
            Helpdesk Ticketing Platform
          </p>

          <h1>Create ticket</h1>

          <p>
            Submit a new support request to the helpdesk team.
          </p>
        </div>

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
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
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
            disabled={isLoadingCategories}
            required
          >
            {isLoadingCategories && (
              <option value="">
                Loading categories...
              </option>
            )}

            {!isLoadingCategories &&
              categories.length === 0 && (
                <option value="">
                  No categories available
                </option>
              )}

            {!isLoadingCategories &&
              categories.map(
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

          {error && (
            <p
              className="login-form__error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="create-ticket-form__actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                navigate('/tickets')
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingCategories ||
                categories.length === 0
              }
            >
              {isSubmitting
                ? 'Creating...'
                : 'Create ticket'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}