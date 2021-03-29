import {consume} from '@layr/component';
import {Routable, route} from '@layr/routable';
import React, {useMemo} from 'react';
import {view, useAsyncMemo, useAsyncCallback} from '@layr/react-integration';

import type {Movie as BackendMovie} from '../../../backend/src/components/movie';
import type {Application} from './application';

export const getMovie = (Base: typeof BackendMovie) => {
  class Movie extends Routable(Base) {
    ['constructor']!: typeof Movie;

    @consume() static Application: typeof Application;

    @view() static LayoutView({children}: {children?: React.ReactNode}) {
      return (
        <this.Application.LayoutView>
          <h2>Movie</h2>
          {children}
        </this.Application.LayoutView>
      );
    }

    // TODO: Move this after EditPage
    @route('/movies/add') @view() static AddPage() {
      const movie = useMemo(() => new this(), []);

      const [handleSave, , savingError] = useAsyncCallback(async () => {
        await movie.save();
        this.Application.HomePage.navigate();
      }, [movie]);

      return (
        <this.LayoutView>
          {savingError && <p>Sorry, something went wrong while saving the movie.</p>}
          <movie.Form onSubmit={handleSave} />
          <p>
            ‹ <this.Application.HomePage.Link>Back</this.Application.HomePage.Link>
          </p>
        </this.LayoutView>
      );
    }

    @route('/movies/:id') @view() static HomePage({id}: {id: string}) {
      const [movie, isLoading, loadingError] = useAsyncMemo(async () => {
        return await this.get(id, {title: true, year: true, country: true});
      }, [id]);

      const [handleDelete, isDeleting, deletingError] = useAsyncCallback(async () => {
        await movie!.delete();
        this.Application.HomePage.navigate();
      }, [movie]);

      if (isLoading) {
        return null;
      }

      if (loadingError || movie === undefined) {
        return <div>Sorry, something went wrong while loading the movie.</div>;
      }

      return (
        <this.LayoutView>
          {deletingError && <p>Sorry, something went wrong while deleting the movie.</p>}
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>{movie.title}</td>
              </tr>
              <tr>
                <td>Year:</td>
                <td>{movie.year}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{movie.country}</td>
              </tr>
            </tbody>
          </table>
          <p>
            <button
              onClick={() => {
                this.EditPage.navigate(movie);
              }}
              disabled={isDeleting}
            >
              Edit
            </button>
            &nbsp;
            <button onClick={handleDelete} disabled={isDeleting}>
              Delete
            </button>
          </p>
          <p>
            ‹ <this.Application.HomePage.Link>Back</this.Application.HomePage.Link>
          </p>
        </this.LayoutView>
      );
    }

    @route('/movies/:id/edit') @view() static EditPage({id}: {id: string}) {
      // TODO: DRY
      const [movie, isLoading, loadingError] = useAsyncMemo(async () => {
        return await this.get(id, {title: true, year: true, country: true});
      }, [id]);

      const forkedMovie = useMemo(() => movie?.fork(), [movie]);

      const [handleSave, , savingError] = useAsyncCallback(async () => {
        await forkedMovie!.save();
        movie!.merge(forkedMovie!);
        this.HomePage.navigate(movie!);
      }, [movie, forkedMovie]);

      if (isLoading) {
        return null;
      }

      if (loadingError || forkedMovie === undefined) {
        return <div>Sorry, something went wrong while loading the movie.</div>;
      }

      return (
        <this.LayoutView>
          {savingError && <p>Sorry, something went wrong while saving the movie.</p>}
          <forkedMovie.Form onSubmit={handleSave} />
          <p>
            ‹ <this.HomePage.Link params={movie}>Back</this.HomePage.Link>
          </p>
        </this.LayoutView>
      );
    }

    @view() static ListView() {
      const [movies, isLoading, loadingError] = useAsyncMemo(async () => {
        return await this.find({}, {title: true, year: true}, {sort: {year: 'desc', title: 'asc'}});
      }, []);

      if (isLoading) {
        return null;
      }

      if (loadingError) {
        return <div>Sorry, something went wrong while loading the movies.</div>;
      }

      return (
        <div>
          <ul>
            {movies!.map((movie) => (
              <li key={movie.id}>
                <this.HomePage.Link params={movie}>{movie.title}</this.HomePage.Link>
                {movie.year !== undefined ? ` (${movie.year})` : ''}
              </li>
            ))}
          </ul>

          <p>
            <button
              onClick={() => {
                this.AddPage.navigate();
              }}
            >
              New
            </button>
          </p>
        </div>
      );
    }

    @view() Form({onSubmit}: {onSubmit: Function}) {
      const [handleSubmit, isSubmitting] = useAsyncCallback(
        async (event) => {
          event.preventDefault();
          await onSubmit();
        },
        [onSubmit]
      );

      return (
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>
                  <input
                    value={this.title}
                    onChange={(event) => {
                      this.title = event.target.value;
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Year:</td>
                <td>
                  <input
                    value={this.year !== undefined ? String(this.year) : ''}
                    onChange={(event) => {
                      this.year = Number(event.target.value) || undefined;
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>
                  <input
                    value={this.country}
                    onChange={(event) => {
                      this.country = event.target.value;
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </p>
        </form>
      );
    }
  }

  return Movie;
};

export declare const Movie: ReturnType<typeof getMovie>;

export type Movie = InstanceType<typeof Movie>;
