package com.ayush.service.clients;

import com.razorpay.RazorpayException;
import com.ayush.domain.PaymentMethod;
import com.ayush.exception.UserException;
import com.ayush.modal.Booking;
import com.ayush.payload.dto.BookingDTO;
import com.ayush.payload.response.PaymentLinkResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("payment")
public interface PaymentFeignClient {

    @PostMapping("/api/payments/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Booking booking,
            @RequestParam PaymentMethod paymentMethod) throws UserException,
            RazorpayException;
}
