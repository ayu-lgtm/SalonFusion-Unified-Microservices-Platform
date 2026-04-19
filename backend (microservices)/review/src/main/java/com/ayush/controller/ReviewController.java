package com.ayush.controller;


import com.ayush.exception.UserException;
import com.ayush.mapper.ReviewMapper;
import com.ayush.modal.Review;

import com.ayush.payload.dto.ReviewDTO;
import com.ayush.payload.dto.SalonDTO;
import com.ayush.payload.dto.UserDTO;
import com.ayush.payload.request.CreateReviewRequest;
import com.ayush.payload.response.ApiResponse;

import com.ayush.service.ReviewService;
import com.ayush.service.clients.SalonFeignClient;
import com.ayush.service.clients.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserFeignClient userService;
    private final SalonFeignClient salonService;

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProductId(
            @PathVariable Long salonId) {

        List<Review> reviews = reviewService.getReviewsBySalonId(salonId);

        List<ReviewDTO> reviewDTOS =  reviews.stream().map((review)->
                {
                    UserDTO user= null;
                    try {
                        user = userService.getUserById(review.getUserId()).getBody();
                    } catch (UserException e) {
                        throw new RuntimeException(e);
                    }
                    return ReviewMapper.mapToDTO(review,user);
                }
        ).toList();

        return ResponseEntity.ok(reviewDTOS);

    }

    @PostMapping("/salon/{salonId}")
    public ResponseEntity<ReviewDTO> writeReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long salonId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userService.getUserFromJwtToken(jwt).getBody();
        SalonDTO product = salonService.getSalonById(salonId).getBody();


        Review review = reviewService.createReview(
                req, user, product
        );
        UserDTO reviewer = userService.getUserById(
                review.getUserId()
        ).getBody();

        ReviewDTO reviewDTO= ReviewMapper.mapToDTO(review,reviewer);

        return ResponseEntity.ok(reviewDTO);

    }

    @PatchMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        UserDTO user = userService.getUserFromJwtToken(jwt).getBody();

        Review review = reviewService.updateReview(
                reviewId,
                req.getReviewText(),
                req.getReviewRating(),
                user.getId()
        );
        return ResponseEntity.ok(review);

    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws Exception
            {

        UserDTO user = userService.getUserFromJwtToken(jwt).getBody();

        reviewService.deleteReview(reviewId, user.getId());
        ApiResponse res = new ApiResponse("Review deleted successfully");


        return ResponseEntity.ok(res);

    }
}
