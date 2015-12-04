module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(req, reply) {
      reply.view('index/index', {
        currentTime: new Date()
      });
    }
  }
];
