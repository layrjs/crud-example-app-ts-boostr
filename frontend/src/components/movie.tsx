import {consume} from '@layr/component';
import {Routable} from '@layr/routable';
import React, {Fragment, useMemo} from 'react';
import {layout, page, view, useData, useAction} from '@layr/react-integration';

import type {Movie as BackendMovie} from '../../../backend/src/components/movie';
import type {Application} from './application';

export const createMovieComponent = (Base: typeof BackendMovie) => {
  class Movie extends Routable(Base) {
    ['constructor']!: typeof Movie;

    @consume() static Application: typeof Application;

    @layout('[/]movies/:id') ItemLayout({children}: {children: () => any}) {
      return useData(
        async () => {
          await this.load({title: true, year: true, country: true});
        },

        () => (
          <>
            <h2>Movie</h2>
            {children()}
          </>
        ),

        [], // Getter deps

        [children] // Renderer deps
      );
    }

    @page('[/movies/:id]') ItemPage() {
      const deleteMovie = useAction(async () => {
        await this.delete();
        this.constructor.Application.HomePage.navigate();
      });

      return (
        <>
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>{this.title}</td>
              </tr>
              <tr>
                <td>Year:</td>
                <td>{this.year}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{this.country}</td>
              </tr>
            </tbody>
          </table>
          <p>
            <button
              onClick={() => {
                this.EditPage.navigate();
              }}
            >
              Edit
            </button>
            &nbsp;
            <button onClick={deleteMovie}>Delete</button>
          </p>
          <p>
            ‹{' '}
            <this.constructor.Application.HomePage.Link>
              Back
            </this.constructor.Application.HomePage.Link>
          </p>
        </>
      );
    }

    @page('[/movies/:id]/edit') EditPage() {
      const forkedMovie = useMemo(() => this.fork(), []);

      const save = useAction(async () => {
        await forkedMovie.save();
        this.merge(forkedMovie);
        this.ItemPage.navigate();
      });

      return (
        <>
          <forkedMovie.Form onSubmit={save} />
          <p>
            ‹ <this.ItemPage.Link>Back</this.ItemPage.Link>
          </p>
        </>
      );
    }

    @page('[/]movies/add') static AddPage() {
      const movie = useMemo(() => new this(), []);

      const save = useAction(async () => {
        await movie.save();
        this.Application.HomePage.navigate();
      });

      return (
        <>
          <h2>Add movie</h2>
          <movie.Form onSubmit={save} />
          <p>
            ‹ <this.Application.HomePage.Link>Back</this.Application.HomePage.Link>
          </p>
        </>
      );
    }

    @view() static ListView() {
      return useData(
        async () =>
          await this.find({}, {title: true, year: true}, {sort: {year: 'desc', title: 'asc'}}),

        (movies) => (
          <>
            <ul>
              {movies.map((movie) => (
                <li key={movie.id}>
                  <movie.ItemPage.Link>{movie.title}</movie.ItemPage.Link>
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
          </>
        )
      );
    }

    @view() Form({onSubmit}: {onSubmit: Function}) {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
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
            <button type="submit">Save</button>
          </p>
        </form>
      );
    }
  }

  return Movie;
};

export declare const Movie: ReturnType<typeof createMovieComponent>;

export type Movie = InstanceType<typeof Movie>;
