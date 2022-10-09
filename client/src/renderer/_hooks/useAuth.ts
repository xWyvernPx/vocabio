import React, { useCallback, useEffect } from 'react';
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from 'renderer/redux/slice/authSlice';

type Props = {};

const GET_ME_QUERY = gql`
  query {
    me {
      _id
      username
      avatar
      email
    }
  }
`;
const useAuth = () => {
  const { data, error, loading } = useQuery(GET_ME_QUERY);
  const dispatch = useDispatch();
  const client = useApolloClient();
  const user = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    if (data?.me) {
      dispatch(loginSuccess({ user: data?.me }));
    }
  }, [data, loading]);

  const login = useCallback(async (username: string, password: string) => {
    const QUERY_lOGIN = gql`
      query LOGIN($username: String, $password: String) {
        login(username: $username, password: $password) {
          _id
          username
          avatar
          email
        }
      }
    `;
    const result = await client.query({
      query: QUERY_lOGIN,
      variables: { username: username, password: password },
    });
    if (result?.data?.login)
      dispatch(loginSuccess({ user: result?.data?.login }));
  }, []);
  return { user, login };
};

export default useAuth;
