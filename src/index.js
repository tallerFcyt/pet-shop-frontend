import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client'
import { AuthProvider } from './context/AuthContext';
import { API_URL } from './utils/config';

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${API_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
})

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
);