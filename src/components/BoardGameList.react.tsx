import * as React from 'react';
import { Text } from 'react-native';
import { User } from './models/User';

interface BoardGameListProps {
    user: User;
}

export class BoardGameList extends React.Component<BoardGameListProps, {}> {
    public render() {
        return <Text>Hello {this.props.user.name}</Text>
    }
}