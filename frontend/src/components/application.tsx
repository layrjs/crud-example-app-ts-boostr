import {provide} from '@layr/component';
import {Routable} from '@layr/routable';
import React, {Fragment} from 'react';
import {layout, page} from '@layr/react-integration';

import type {Application as BackendApplication} from '../../../backend/src/components/application';
import {createMovieComponent} from './movie';

export const createApplicationComponent = (Base: typeof BackendApplication) => {
  class Application extends Routable(Base) {
    ['constructor']!: typeof Application;

    @provide() static Movie = createMovieComponent(Base.Movie);

    @layout('/') static MainLayout({children}: {children: () => any}) {
      return (
        <>
          <this.HomePage.Link>
            <h1>CRUD example app</h1>
          </this.HomePage.Link>
          {children()}
        </>
      );
    }

    @page('[/]') static HomePage() {
      return (
        <>
          <h2>Movies</h2>
          <this.Movie.ListView />
        </>
      );
    }

    @page('[/]*') static NotFoundPage() {
      return (
        <>
          <h2>Route not found</h2>
          <p>Sorry, there is nothing here.</p>
        </>
      );
    }
  }

  return Application;
};

export declare const Application: ReturnType<typeof createApplicationComponent>;

export type Application = InstanceType<typeof Application>;
