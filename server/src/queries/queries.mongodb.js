use('shm-chat');

db.messages.aggregate([
  {
    $match: {
      body: { $regex: 'паровоз', $options: 'i' },
    },
  },
  {
    $count: 'totalMessages',
  },
]);
