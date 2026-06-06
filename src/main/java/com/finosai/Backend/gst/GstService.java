package com.finosai.Backend.gst;

import com.finosai.Backend.gst.dto.GstRequest;
import org.springframework.stereotype.Service;

@Service
public class GstService {

    public GstResponse calculateGst(
            GstRequest request) {

        double gstAmount =
                request.getAmount() *
                        request.getGstRate() / 100;

        double totalAmount =
                request.getAmount() + gstAmount;

        return new GstResponse(
                request.getAmount(),
                gstAmount,
                totalAmount
        );
    }
}