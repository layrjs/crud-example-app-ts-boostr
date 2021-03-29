import {provide} from '@layr/component';
import {Routable, route} from '@layr/routable';
import React from 'react';
import {view} from '@layr/react-integration';

import type {Application as BackendApplication} from '../../../backend/src/components/application';
import {getMovie} from './movie';

export const getApplication = (Base: typeof BackendApplication) => {
  class Application extends Routable(Base) {
    ['constructor']!: typeof Application;

    @provide() static Movie = getMovie(Base.Movie);

    @view() static LayoutView({children}: {children?: React.ReactNode}) {
      return (
        <div>
          <h1>CRUD example app</h1>
          {children}
        </div>
      );
    }

    @route('/') @view() static HomePage() {
      return (
        <this.LayoutView>
          <div>
            <h2>Movies</h2>
            <this.Movie.ListView />
          </div>
        </this.LayoutView>
      );
    }
  }

  return Application;
};

export declare const Application: ReturnType<typeof getApplication>;

export type Application = InstanceType<typeof Application>;
