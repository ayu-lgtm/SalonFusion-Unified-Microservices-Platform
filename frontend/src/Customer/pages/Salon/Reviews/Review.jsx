import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../../../Redux/Review/action";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import { Divider } from "@mui/material";
import RatingCard from "./RatingCard";

const Review = () => {
  const dispatch = useDispatch();
  const { review } = useSelector((store) => store);
  const { id } = useParams();

  useEffect(() => {
    if (id) dispatch(fetchReviews({ salonId: id, jwt: localStorage.getItem("jwt") }));
  }, [id]);

  return (
    <div className="pt-6 flex flex-col lg:flex-row gap-10">
      <section className="w-full lg:w-[38%]">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Ratings & Reviews</h2>
        <RatingCard totalReview={review.reviews.length} />
      </section>
      <section className="w-full lg:w-[62%]">
        {review.reviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-sm">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {review.reviews.map((item, i) => (
              <div key={item.id} className="space-y-5">
                <ReviewCard item={item} />
                {review.reviews.length - 1 !== i && <Divider sx={{ borderColor: "#f1f5f9" }} />}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Review;