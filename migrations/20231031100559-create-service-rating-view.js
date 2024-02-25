'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `
    CREATE VIEW serviceRatingViews AS 
        SELECT 
	          service_id,
            barber_id,
            count(*) AS total_rating,
            avg(rating) AS total_avg,
            (SELECT count(*) 
            from rating_reviews as orr
            where orr.rating = 1 and orr.service_id = rr.service_id ) AS total_one,
            (SELECT count(*) 
            from rating_reviews as orr
            where orr.rating = 2 and orr.service_id = rr.service_id ) AS total_two,
            (SELECT count(*) 
            from rating_reviews as orr
            where orr.rating = 3 and orr.service_id = rr.service_id ) AS total_three,
            (SELECT count(*) 
            from rating_reviews as orr
            where orr.rating = 4 and orr.service_id = rr.service_id ) AS total_four,
            (SELECT count(*) 
            from rating_reviews as orr
            where orr.rating = 5 and orr.service_id = rr.service_id ) AS total_five
        FROM rating_reviews AS rr
        group by service_id , barber_id;
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('drop view serviceRatingViews');
  }
};