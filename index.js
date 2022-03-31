const { ApolloServer, gql } = require("apollo-server");
const { events, users, locations, participants } = require("./data");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event]!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
    event_id: ID!
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!

    user_id: ID!
    user: User!

    location: Location!
    location_id: ID!

    participant: [Participant!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!

    events: [Event!]!
    event(id: ID!): Event!

    locations: [Location!]!
    location(id: ID!): Location!

    participants: [Participant!]!
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    // Users
    users: () => users,
    user: (parents, args) => users.find((user) => user.id == args.id),
    // Events
    events: () => events,
    event: (parents, args) => events.find((event) => event.id == args.id),

    // Locations
    locations: () => locations,
    location: (parents, args) =>
      locations.find((location) => location.id == args.id),
    // Participant
    participants: () => participants,
    participant: (parents, args) =>
      participants.find((participant) => participant.id == args.id),
  },

  User: {
    events: (parents, args) =>
      events.filter((event) => event.user_id == parents.id),
  },
  Event: {
    user: (parents, args) => users.find((user) => user.id == parents.user_id),
    location: (parents, args) =>
      locations.find((location) => location.id == parents.location_id),
    participant: (parents, args) =>
      participants.filter((participant) => participant.event_id == parents.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // option
    }),
  ],
});

server
  .listen()
  .then(({ url }) => console.log(`Graphql server is up at ${url}`));
