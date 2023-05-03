import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client'
import { AuthProvider } from './context/AuthContext';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
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

